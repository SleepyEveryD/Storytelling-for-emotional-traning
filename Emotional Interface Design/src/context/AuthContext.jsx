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