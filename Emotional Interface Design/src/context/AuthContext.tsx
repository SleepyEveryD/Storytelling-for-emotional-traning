import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../supabase_client";

const AuthContext = createContext();

// 定义允许的角色类型
const ALLOWED_ROLES = {
    USER: 'user',
    THERAPIST: 'therapist'
};

export const AuthContextProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 获取当前会话
        const getSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;
                
                setSession(session);
                setUser(session?.user || null);
            } catch (error) {
                console.error("Error getting session:", error.message);
            } finally {
                setLoading(false);
            }
        };

        getSession();

        // 监听认证状态变化
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session);
                setUser(session?.user || null);
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // 登录函数
    const signIn = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    };

    // 注册函数 - 添加角色验证和设置
    const signUp = async (email, password, role = ALLOWED_ROLES.USER, additionalMetadata = {}) => {
        try {
            // 验证角色是否合法
            if (!Object.values(ALLOWED_ROLES).includes(role)) {
                throw new Error(`无效的角色类型。只允许: ${Object.values(ALLOWED_ROLES).join(', ')}`);
            }

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        role: role, // 设置用户角色
                        created_at: new Date().toISOString(),
                        ...additionalMetadata // 其他可选元数据
                    },
                },
            });
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    };

    // 专门的治疗师注册函数
    const signUpAsTherapist = async (email, password, therapistData = {}) => {
        return await signUp(
            email, 
            password, 
            ALLOWED_ROLES.THERAPIST, 
            therapistData
        );
    };

    // 专门的用户注册函数
    const signUpAsUser = async (email, password, userData = {}) => {
        return await signUp(
            email, 
            password, 
            ALLOWED_ROLES.USER, 
            userData
        );
    };

    // 治疗师创建患者账户（保持治疗师登录状态）
    const createPatientAccount = async (patientData) => {
        try {
            const { email, password, name, age, notes } = patientData;
            
            // 1. 首先检查邮箱是否已存在
            const { data: existingUser, error: checkError } = await supabase
                .from('profiles')
                .select('id, email')
                .eq('email', email)
                .single();

            if (existingUser) {
                throw new Error('该邮箱已被注册');
            }

            // 2. 创建患者账户
            const { data: authData, error: signUpError } = await signUpAsUser(
                email, 
                password, 
                { 
                    name,
                    age,
                    notes,
                    created_by: user.id, // 记录创建者（治疗师ID）
                    therapist_id: user.id, // 关联的治疗师
                    created_at: new Date().toISOString()
                }
            );

            if (signUpError) throw signUpError;

            // 3. 在 patients 表中创建关联记录（如果需要）
            if (authData.user) {
                const { error: patientError } = await supabase
                    .from('patients')
                    .insert({
                        patient_id: authData.user.id,
                        therapist_id: user.id,
                        name: name,
                        email: email,
                        age: age,
                        notes: notes,
                        created_at: new Date().toISOString()
                    });

                if (patientError) {
                    console.error('创建患者关联记录失败:', patientError);
                    // 这里不抛出错误，因为用户账户已经创建成功
                }

                console.log('患者账户创建成功:', authData.user.id);
            }

            return { 
                data: authData, 
                error: null 
            };
        } catch (error) {
            console.error('创建患者账户失败:', error);
            return { 
                data: null, 
                error: error.message || '创建患者账户失败'
            };
        }
    };

    // 批量创建患者账户
    const createMultiplePatientAccounts = async (patientsData) => {
        const results = [];
        
        for (const patientData of patientsData) {
            const result = await createPatientAccount(patientData);
            results.push({
                email: patientData.email,
                ...result
            });
        }
        
        return results;
    };

    // 获取当前治疗师的所有患者
    const getTherapistPatients = async () => {
        try {
            if (!user || !isTherapist) {
                throw new Error('只有治疗师可以查看患者列表');
            }

            const { data, error } = await supabase
                .from('patients')
                .select(`
                    *,
                    profiles:patient_id (name, email, user_metadata)
                `)
                .eq('therapist_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    };

    // 更新患者信息
    const updatePatientInfo = async (patientId, updates) => {
        try {
            if (!user || !isTherapist) {
                throw new Error('只有治疗师可以更新患者信息');
            }

            // 验证治疗师是否有权限更新这个患者
            const { data: patient, error: checkError } = await supabase
                .from('patients')
                .select('therapist_id')
                .eq('patient_id', patientId)
                .single();

            if (checkError) throw checkError;
            if (patient.therapist_id !== user.id) {
                throw new Error('无权更新此患者信息');
            }

            const { data, error } = await supabase
                .from('patients')
                .update(updates)
                .eq('patient_id', patientId);

            if (error) throw error;

            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    };

    // 重置患者密码（需要 Supabase 管理员权限或使用 email reset）
    const resetPatientPassword = async (patientEmail) => {
        try {
            const { data, error } = await supabase.auth.resetPasswordForEmail(patientEmail, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    };

    // 更新用户角色（管理员功能）
    const updateUserRole = async (newRole) => {
        try {
            // 验证角色是否合法
            if (!Object.values(ALLOWED_ROLES).includes(newRole)) {
                throw new Error(`无效的角色类型。只允许: ${Object.values(ALLOWED_ROLES).join(', ')}`);
            }

            const { data, error } = await supabase.auth.updateUser({
                data: { 
                    role: newRole,
                    role_updated_at: new Date().toISOString()
                }
            });
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    };

    // 登出函数
    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            return { error: null };
        } catch (error) {
            return { error };
        }
    };

    const value = {
        session,
        user,
        loading,
        signIn,
        signUp,           // 通用注册
        signUpAsUser,     // 用户注册
        signUpAsTherapist, // 治疗师注册
        signOut,
        updateUserRole,
        // 治疗师患者管理功能
        createPatientAccount,
        createMultiplePatientAccounts,
        getTherapistPatients,
        updatePatientInfo,
        resetPatientPassword,
        isAuthenticated: !!session,
        // 角色检查助手函数
        isTherapist: user?.user_metadata?.role === ALLOWED_ROLES.THERAPIST,
        isUser: user?.user_metadata?.role === ALLOWED_ROLES.USER,
        userRole: user?.user_metadata?.role,
        ALLOWED_ROLES, // 导出允许的角色常量
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthContextProvider");
    }
    return context;
};