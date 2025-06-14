import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { memo, useCallback } from "react";
import { CreateAccountForm } from "./create-account-form";

interface CreateAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: { address: string };
  onSuccess: () => void;
  setCreateAccountError: (err: string) => void;
  setCreateStep: (step: number) => void;
  handleCancelAndLogout: () => void;
}

const CreateAccountDialog = memo(
  ({
    open,
    onOpenChange,
    account,
    onSuccess,
    setCreateAccountError,
    setCreateStep,
    handleCancelAndLogout,
  }: CreateAccountDialogProps) => {
    const handleCancel = useCallback(() => {
      handleCancelAndLogout();
    }, [handleCancelAndLogout]);

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="no-x-close max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Your Account</DialogTitle>
            <DialogDescription>
              Please fill in your details to complete your account setup.
            </DialogDescription>
          </DialogHeader>
          {account?.address && (
            <CreateAccountForm
              walletAddress={account.address}
              onSuccess={onSuccess}
              setCreateAccountError={setCreateAccountError}
              onStepChange={setCreateStep}
            />
          )}
          {account?.address && (
            <DialogFooter className="flex flex-row-reverse justify-between gap-2">
              <Button variant="destructive" onClick={handleCancel}>
                Cancel and Logout
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    );
  },
);

CreateAccountDialog.displayName = "CreateAccountDialog";

export { CreateAccountDialog };
