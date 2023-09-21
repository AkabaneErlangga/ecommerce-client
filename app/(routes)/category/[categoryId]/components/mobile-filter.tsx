"use client"

import Button from "@/components/ui/button";
import IconButton from "@/components/ui/icon-button";
import { Color, Size } from "@/types";
import { Dialog } from "@headlessui/react";
import { FilterIcon, PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";
import Filter from "./filter";

interface MobileFilterProps {
  sizes: Size[]
  colors: Color[]
}

const MobileFilter: React.FC<MobileFilterProps> = ({
  sizes,
  colors
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <>
      <Button onClick={onOpen} className="flex items-center gap-x-2 lg:hidden">
        <FilterIcon size={20} />
        Filters
      </Button>

      <Dialog open={isOpen} as="div" className="relative z-40 lg:hidden" onClose={onClose}>
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50" />

        <div className="fixed inset-0 z-40 flex">
          <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 shadow-xl">

            <div className="flex items-center justify-end px-4">
              <IconButton icon={<XIcon size={15} />} onClick={onClose} />
            </div>

            <div className="p-6">
              <Filter
                valueKey="SizeId"
                name="Size"
                data={sizes}
              />
              <Filter
                valueKey="ColorId"
                name="Color"
                data={colors}
              />
            </div>
          </Dialog.Panel>
        </div>



      </Dialog>
    </>
  );
}

export default MobileFilter;