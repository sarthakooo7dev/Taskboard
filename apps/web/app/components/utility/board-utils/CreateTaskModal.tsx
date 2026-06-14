'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  ArrowUpFromLine,
  Check,
  CircleDashed,
  CircleDot,
  CircleSmall,
  Flag,
  Loader2,
  MoveRight,
  User,
  User2,
} from 'lucide-react'
import {
  availableStatusType,
  boardMember,
  CreateTaskModalProps,
  TaskPriority,
} from '@/app/types/general.types'
import {
  PRIORITIES,
  priorityStyles,
  priorityStyles_2,
} from '@/app/lib/utils/ui/boardHelpers'
import Image from 'next/image'

const CreateTaskModal = ({
  open,
  onOpenChange,
  membersList,
  isPending = false,
  onSubmit,
}: CreateTaskModalProps) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM')
  const [assignedToId, setAssignedToId] = useState<string | null>(null)

  const handleCreate = () => {
    onSubmit({
      title,
      description,
      priority,
      ...(assignedToId && { assignedToId }),
    })
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setPriority('MEDIUM')
    setAssignedToId(null)
  }

  useEffect(() => {
    if (!open) {
      resetForm()
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px] border border-white/10 bg-dk_grey p-1">
        <div className="p-5">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-300 tracking-wider">
              Create Task
            </DialogTitle>
          </DialogHeader>
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          <div className="mt-3 space-y-3">
            <Input
              placeholder="Task title..."
              value={title}
              disabled={isPending}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 text-gray-300 placeholder:tracking-wider"
            />

            <Textarea
              placeholder="Add a description..."
              value={description}
              disabled={isPending}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px] resize-none text-gray-300 placeholder:tracking-wider "
            />

            <div>
              <p className="mb-2 text-[14px] text-gray-300 tracking-wider flex items-center gap-2">
                <Flag size={14} className="text-purple-600" /> Priority
              </p>

              <div className="grid grid-cols-3 gap-3 px-3">
                {PRIORITIES.map((item) => (
                  <button
                    key={item}
                    disabled={isPending}
                    onClick={() => setPriority(item)}
                    className={`h-7  px-0 rounded-md border  transition text-[11px] tracking-widest flex items-center justify-center gap-2 ${
                      priority === item
                        ? `${priorityStyles[priority]} `
                        : 'border-white/10 text-gray-400'
                    }`}
                  >
                    <CircleSmall size={12} /> {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[14px] text-gray-300 tracking-wider flex items-center gap-2">
                <User2 size={16} className="text-purple-600" /> Assignee
              </p>
              <Select
                value={assignedToId ?? 'unassigned'}
                disabled={isPending}
                onValueChange={(value) =>
                  setAssignedToId(value === 'unassigned' ? null : value)
                }
              >
                <SelectTrigger className="w-full  px-3 text-gray-400 tracking-wider">
                  <SelectValue placeholder="Assign member" />
                </SelectTrigger>

                <SelectContent
                  align="end"
                  position="popper"
                  className="bg-dk_grey  min-w-[var(--radix-select-trigger-width)] py-2 tracking-wider "
                >
                  <SelectItem
                    value="unassigned"
                    className="cursor-pointer hover:bg-lg_grey/20 "
                  >
                    <div className="w-full flex items-center text-gray-400 gap-2 ">
                      <User size={14} />
                      Unassigned
                    </div>
                  </SelectItem>

                  {membersList.map((member) => (
                    <SelectItem
                      key={member.id}
                      value={member.id}
                      className="cursor-pointer hover:bg-lg_grey/20 text-gray-400 "
                    >
                      <div className="flex items-center gap-2">
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          width={19}
                          height={19}
                          className="rounded-full"
                        />{' '}
                        {member.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <Button
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
              className="tracking-wider px-5 text-gray-300"
            >
              Cancel
            </Button>

            <Button
              variant="default"
              disabled={isPending || !(title.trim().length > 3)}
              onClick={handleCreate}
              className=" bg-purple-500/50 text-gray-50 tracking-wider px-5"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Create
                  <MoveRight size={12} />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateTaskModal
