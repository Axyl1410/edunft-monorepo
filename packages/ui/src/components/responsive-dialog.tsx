import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog.js";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer.js";
import { useIsMobile } from "../hooks/use-mobile.js";

interface ResponsiveDialogProps {
  children?: React.ReactNode;
  title?: string | React.ReactNode;
  description?: string;
  trigger?: React.ReactNode;
  closeButton?: React.ReactNode;
  content?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * ResponsiveDialog Usage Examples
 *
 * This component automatically renders as a bottom drawer on mobile devices
 * and as a centered modal dialog on desktop/tablet devices.
 *
 * Usage Options:
 *
 * 1. Basic usage with children content:
 *    <ResponsiveDialog title="My Dialog" trigger={<Button>Open</Button>}>
 *      <div>Dialog content goes here</div>
 *    </ResponsiveDialog>
 *
 * 2. Using the content prop instead of children:
 *    <ResponsiveDialog
 *      title="My Dialog"
 *      trigger={<Button>Open</Button>}
 *      content={<div>Dialog content goes here</div>}
 *    />
 *
 * 3. Controlled dialog (managing open state externally):
 *    const [isOpen, setIsOpen] = useState(false);
 *    <ResponsiveDialog
 *      open={isOpen}
 *      onOpenChange={setIsOpen}
 *      title="Controlled Dialog"
 *      trigger={<Button>Open</Button>}
 *    >
 *      <div>Controlled dialog content</div>
 *  </ResponsiveDialog>
 *
 * Available props:
 * - title: String or ReactNode for the dialog header
 * - trigger: ReactNode that opens the dialog when clicked
 * - closeButton: ReactNode for the close button in the footer
 * - content: Alternative to children for dialog content
 * - open: Boolean to control dialog visibility (for controlled usage)
 * - onOpenChange: Callback function when dialog open state changes
 * - children: Dialog content (alternative to content prop)
 */

const ResponsiveDialog: React.FC<ResponsiveDialogProps> = ({
  children,
  title = "Dialog",
  trigger = <button className="btn">Open</button>,
  closeButton = <button className="btn">Close</button>,
  content,
  open,
  onOpenChange,
  description,
}) => {
  const isMobile = useIsMobile();
  const contentToDisplay = content || children;

  const dialogProps = {
    open,
    onOpenChange,
  };

  return (
    <>
      {isMobile ? (
        <Drawer {...dialogProps}>
          <DrawerTrigger asChild>{trigger}</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{title}</DrawerTitle>
            </DrawerHeader>
            <DrawerDescription className="p-4 pt-0">
              {description}
            </DrawerDescription>
            <div className="px-4">{contentToDisplay}</div>
            <DrawerFooter>
              <DrawerClose asChild>{closeButton}</DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog {...dialogProps}>
          <DialogTrigger asChild>{trigger}</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <DialogDescription>{description}</DialogDescription>
            <div>{contentToDisplay}</div>
            <DialogFooter>
              <DialogClose asChild>{closeButton}</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ResponsiveDialog;
