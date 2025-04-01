import * as React from 'react';
import { cn } from '@/utils/style.utils.ts';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-grey-300 placeholder:text-muted-foreground focus:border-primary aria-invalid:ring-destructive/20 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-32 w-full rounded-lg border bg-transparent p-3 text-base transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
