import React, { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default function IndustryCombobox({ value, onChange, industries, totalCount }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-48 justify-between bg-slate-900/50 border-slate-700 text-white hover:bg-slate-800/50 hover:text-white"
        >
          {value === 'all' ? `全部行业 (${totalCount})` : value}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-slate-800 border-slate-700">
        <Command className="bg-slate-800">
          <CommandInput 
            placeholder="搜索行业..." 
            className="h-9 text-white border-slate-700"
          />
          <CommandList>
            <CommandEmpty className="text-slate-400 py-6 text-center text-sm">
              未找到匹配行业
            </CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="all"
                onSelect={() => {
                  onChange('all');
                  setOpen(false);
                }}
                className="text-white hover:bg-slate-700 cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === 'all' ? "opacity-100" : "opacity-0"
                  )}
                />
                全部行业 ({totalCount})
              </CommandItem>
              {industries.map((industry) => (
                <CommandItem
                  key={industry.name}
                  value={industry.name}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                  className="text-white hover:bg-slate-700 cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === industry.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {industry.name} ({industry.count})
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}