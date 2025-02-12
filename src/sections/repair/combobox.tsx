'use client'

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxProps {
  options: any[]
  value: any
  onChange: (value: any) => void
  displayField: string
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
}

export function Combobox({ options = [], value, onChange, displayField, placeholder = "Chọn linh kiện...",
  searchPlaceholder = "Tìm kiếm linh kiện...",
  emptyMessage = "Không tìm thấy linh kiện." }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between truncate"
        >
               {value && value[displayField] ? value[displayField] : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option._id}
                  value={option[displayField]}
                  onSelect={() => {
                    onChange(option)
                    setOpen(false)
                  }}
                >
                  {option[displayField]}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value?._id === option._id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}