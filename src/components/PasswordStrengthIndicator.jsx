import { useMemo } from 'react';
import { Check, X } from 'lucide-react';


const PasswordStrengthIndicator = ({ password }) => {
  const validations = useMemo(() => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };
  }, [password]);

  const strength = useMemo(() => {
    const passedRules = Object.values(validations).filter(Boolean).length;
    
    if (passedRules === 0) return { level: 'none', label: '', color: 'bg-gray-200' };
    if (passedRules <= 2) return { level: 'weak', label: 'Weak', color: 'bg-red-500' };
    if (passedRules <= 4) return { level: 'medium', label: 'Medium', color: 'bg-yellow-500' };
    return { level: 'strong', label: 'Strong', color: 'bg-green-500' };
  }, [validations]);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 overflow-hidden bg-gray-200 rounded-full">
          <div
            className={`h-full transition-all duration-300 ${strength.color}`}
            style={{ width: `${(Object.values(validations).filter(Boolean).length / 5) * 100}%` }}
          />
        </div>
        {strength.label && (
          <span className={`text-xs font-medium ${
            strength.level === 'weak' ? 'text-red-600' :
            strength.level === 'medium' ? 'text-yellow-600' :
            'text-green-600'
          }`}>
            {strength.label}
          </span>
        )}
      </div>

      {/* Validation Checklist */}
      <div className="grid grid-cols-2 gap-1 text-xs">
        <ValidationItem
          isValid={validations.length}
          label="At least 8 characters"
        />
        <ValidationItem
          isValid={validations.uppercase}
          label="Contains uppercase letter (A-Z)"
        />
        <ValidationItem
          isValid={validations.lowercase}
          label="Contains lowercase letter (a-z)"
        />
        <ValidationItem
          isValid={validations.number}
          label="Contains number (0-9)"
        />
        <ValidationItem
          isValid={validations.special}
          label="Contains special character (!@#$%^&*)"
        />
      </div>
    </div>
  );
};

const ValidationItem = ({ isValid, label }) => {
  return (
    <div className={`flex items-center gap-1 ${isValid ? 'text-green-600' : 'text-gray-500'}`}>
      {isValid ? (
        <Check className="w-3 h-3" />
      ) : (
        <X className="w-3 h-3" />
      )}
      <span>{label}</span>
    </div>
  );
};

export default PasswordStrengthIndicator;