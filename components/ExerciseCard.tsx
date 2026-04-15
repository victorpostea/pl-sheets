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
            size="sm"
            className="text-sm"
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
              size="sm"
              className="text-sm"
            />
          </div>
        )}
      </div>

      {/* Last week's weight display */}
      {exercise.lastWeekWeight && (
        <div className="mb-3 p-2 bg-green-500/10 rounded-lg border border-green-500/30">
          <p className="text-xs text-green-400 font-bold uppercase tracking-wide text-center">
            Last Week: <span className="text-white font-mono text-sm">{exercise.lastWeekWeight}</span> lbs
            {exercise.lastWeekRpe ? ` • RPE ${exercise.lastWeekRpe}` : ''}
          </p>
        </div>
      )}

      {/* Collapsible notes section - spans full width */}
      <div className="mt-3 border-t border-gray-700 pt-3 pl-7">
        <details>
          <summary className="list-none cursor-pointer cursor-pointer text-xs font-bold text-gray-400 uppercase tracking-wide hover:text-accent">
            📝 Sheet Notes
          </summary>
          <div className="mt-2 p-3 bg-navy-deep ml-4 rounded-lg">
            <p className="text-gray-300 text-sm">
              Enter your handwritten notes from your sheet here.
            </p>
          </div>
        </details>
      </div>
    </div>
  )
}
