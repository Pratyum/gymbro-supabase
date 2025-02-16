import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent, DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/drawer"
import { useMediaQuery } from "@/hooks/use-media-query"

export function ResponsiveDrawer({
    title,
    trigger,
    children,
    open,
    setOpen,
    description = '',
}:{
    title: string | React.ReactNode;
    trigger?: React.ReactNode;
    description?: string | React.ReactNode;
    children: React.ReactNode;
    open?: boolean;
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const [internalOpen , setInternalOpen] = React.useState(open??false);
    const uncontrolled = open === undefined;

    if (isDesktop) {
        return (
            <Dialog open={uncontrolled? internalOpen : open} onOpenChange={uncontrolled ? setInternalOpen : setOpen}>
                {trigger && <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>}
                <DialogContent className="flex flex-col">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        {description && <DialogDescription>
                            {description}
                        </DialogDescription>}
                    </DialogHeader>
                    {children}
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            {trigger && <DrawerTrigger asChild>
                {trigger}
            </DrawerTrigger>}
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>{title}</DrawerTitle>
                    {description && <DialogDescription>
                        {description}
                    </DialogDescription>}
                </DrawerHeader>
                {children}
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}