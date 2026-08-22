import React from 'react';
import Button from '../common/Button';

const FormActions = ({
  onCancel,
  onSubmit,
  submitText = 'Save Changes',
  cancelText = 'Cancel',
  isLoading = false,
  isDirty = true,
  align = 'right', // 'right' | 'left' | 'between' | 'center'
  className = ''
}) => {
  const alignClasses = {
    right: 'justify-end',
    left: 'justify-start',
    between: 'justify-between',
    center: 'justify-center'
  };

  return (
    <div className={`pt-4 border-t border-slate-100 flex items-center gap-3 ${alignClasses[align] || alignClasses.right} ${className}`}>
      {onCancel && (
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={isLoading}
        >
          {cancelText}
        </Button>
      )}
      <Button
        type="submit"
        variant="primary"
        size="sm"
        onClick={onSubmit}
        isLoading={isLoading}
        disabled={!isDirty}
      >
        {submitText}
      </Button>
    </div>
  );
};

export default FormActions;
