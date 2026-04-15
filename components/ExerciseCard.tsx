'use client'
import { Exercise } from '@/lib/types'
import { InlineField } from './InlineField'

interface Props {
  exercise: Exercise
  onSave: (cell: string, value: string) => Promise<void>
}

export function ExerciseCard({ exercise, onSave }: Props) {
  return (
    <div className="bg-navy-card rounded-lg p-4 border-l-4 border-accent">
      {/* Exercise name + prescribed sets/reps/RPE */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-bold text-white text-sm leading-tight">{exercise.name}</h3>
        <div className="flex gap-2 shrink-0">
          <span className="text-xs bg-navy-deep px-2 py-1 rounded font-bold text-gray-300">
            {exercise.sets}×{exercise.reps}
          </span>
          <span className="text-xs bg-navy-deep px-2 py-1 rounded font-bold text-accent">
            {exercise.isAccessory ? 'RIR' : 'RPE'} {exercise.prescribedRpe}
          </span>
        </div>
      </div>

      {/* Last week's weight + RPE — shown as subtle badges flush to the top right */}
      {(exercise.lastWeekWeight || exercise.lastWeekRpe) && (
        <div className="flex justify-end gap-2 mb-2">
          {exercise.lastWeekWeight && (
            <span className="text-xs bg-navy-deep text-gray-500 px-2 py-0.5 rounded font-bold tracking-wide">
              ↑ {exercise.lastWeekWeight} lbs
            </span>
          )}
          {exercise.lastWeekRpe && (
            <span className="text-xs bg-navy-deep text-gray-500 px-2 py-0.5 rounded font-bold tracking-wide">
              RPE {exercise.lastWeekRpe}
            </span>
          )}
        </div>
      )}

      {/* Editable fields */}
      <div className={`grid gap-3 ${exercise.isAccessory ? 'grid-cols-1' : 'grid-cols-2'}`}>
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">
            Weight (lbs)
          </label>
          <InlineField
            initialValue={exercise.weightUsed}
            placeholder="—"
            onSave={v => onSave(exercise.weightCell, v)}
            inputMode="decimal"
          />
        </div>
        {!exercise.isAccessory && (
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">
              Actual RPE
            </label>
            <InlineField
              initialValue={exercise.actualRpe}
              placeholder="—"
              onSave={v => onSave(exercise.actualRpeCell, v)}
              inputMode="decimal"
            />
          </div>
        )}
      </div>

      {/* Notes field — collapsible, writes to col G */}
      <details className="mt-3 border-t border-gray-700 pt-3">
        <summary className="list-none cursor-pointer text-xs font-bold text-gray-400 uppercase tracking-wide hover:text-accent">
          📝 Notes {exercise.notes ? '·' : ''}
          {exercise.notes && (
            <span className="normal-case font-normal text-gray-500 ml-1 truncate">{exercise.notes}</span>
          )}
        </summary>
        <div className="mt-2">
          <InlineField
            initialValue={exercise.notes}
            placeholder="Add notes..."
            onSave={v => onSave(exercise.notesCell, v)}
            inputMode="numeric"
            isTextarea
          />
        </div>
      </details>
    </div>
  )
}
