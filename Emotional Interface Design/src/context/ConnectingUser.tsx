import { useState } from 'react';
import { supabase } from '../supabase_client'; // Update path accordingly
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';

export const ConnectingUser = () => {
  const [patientId, setPatientId] = useState('');
  const [therapistId, setTherapistId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleConnect = async () => {
    if (!patientId || !therapistId) {
      setMessage('⚠️ Both patient ID and therapist ID are required.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Step 1: Fetch patient based on ID
      const { data: patient, error: fetchError } = await supabase
        .from('patients')
        .select('patient_user_id, therapist_id')
        .eq('patient_user_id', patientId)
        .single();

      if (fetchError || !patient) {
        setMessage('❌ Patient not found.');
        return;
      }

      // Step 2: Check if therapist_id is empty
      if (patient.therapist_id) {
        setMessage('⚠️ This patient is already connected to a therapist.');
        return;
      }

      // Step 3: Update therapist_id for the patient
      const { error: updateError } = await supabase
        .from('patients')
        .update({ therapist_id: therapistId })
        .eq('patient_user_id', patientId);

      if (updateError) {
        setMessage(`❌ Failed to connect: ${updateError.message}`);
      } else {
        setMessage(`🎉 Successfully connected therapist to patient ${patientId}.`);
      }
    } catch (err) {
      console.error(err);
      setMessage(`❌ Unexpected error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-6 border rounded-xl shadow bg-white">
      <h2 className="text-lg font-semibold mb-4">Connect Existing Patient</h2>

      <div>
        <Label htmlFor="patientId">Patient ID</Label>
        <Input
          id="patientId"
          type="text"
          placeholder="Enter patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="therapistId">Therapist ID</Label>
        <Input
          id="therapistId"
          type="text"
          placeholder="Enter therapist ID"
          value={therapistId}
          onChange={(e) => setTherapistId(e.target.value)}
          className="mt-2"
        />
      </div>

      <Button
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        onClick={handleConnect}
        disabled={loading}
      >
        {loading ? 'Connecting...' : 'Connect User'}
      </Button>

      {message && (
        <p
          className={`text-sm mt-3 ${
            message.startsWith('🎉')
              ? 'text-green-600'
              : message.startsWith('⚠️')
              ? 'text-yellow-600'
              : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};
