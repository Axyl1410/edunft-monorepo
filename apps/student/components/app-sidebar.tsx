import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@workspace/ui/components/sidebar";
import { GalleryVerticalEnd } from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <div className="bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md dark:bg-neutral-800">
              <GalleryVerticalEnd size={16} />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Axyl Team</span>
              <span className="truncate text-xs">Student version</span>
            </div>
          </div>
          <div className="bg-secondary truncate rounded-md px-3 py-1.5 text-sm font-semibold">
            EduNFT
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent></SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
