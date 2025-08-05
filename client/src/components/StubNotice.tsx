
import { Alert, AlertDescription } from '@/components/ui/alert';

export function StubNotice() {
  return (
    <Alert className="mb-6 border-amber-200 bg-amber-50">
      <AlertDescription className="text-amber-800">
        ⚠️ <strong>Demo Mode:</strong> This application is currently running with stub data. 
        The backend handlers are not fully implemented, so some features may not work as expected.
        Generated prompts and templates are simulated for demonstration purposes.
      </AlertDescription>
    </Alert>
  );
}
