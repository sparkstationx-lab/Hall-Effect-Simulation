/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Compass, CheckCircle2, AlertCircle, HelpCircle, ArrowRight, Award, RotateCcw, Sparkles } from 'lucide-react';
import { CalculationResults, SimulationParams } from '../types/physics';
import { EXPERIMENT_TASKS } from '../utils/experiments';

interface GuidedExperimentsProps {
  params: SimulationParams;
  setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
  results: CalculationResults;
}

export const GuidedExperiments: React.FC<GuidedExperimentsProps> = ({ params, setParams, results }) => {
  const [activeTaskIndex, setActiveTaskIndex] = useState<number>(0);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' | 'hint' } | null>(null);

  const currentTask = EXPERIMENT_TASKS[activeTaskIndex];
  const totalTasks = EXPERIMENT_TASKS.length;
  const completedCount = Object.keys(completedTasks).length;

  const handleVerifyCurrentTask = () => {
    const isSuccess = currentTask.targetCriteria(params, results);
    if (isSuccess) {
      setCompletedTasks(prev => ({ ...prev, [currentTask.id]: true }));
      setFeedbackMessage({
        text: `Goal Accomplished! ${currentTask.explanation}`,
        type: 'success',
      });
    } else {
      setFeedbackMessage({
        text: `Criteria not met yet. ${currentTask.hint}`,
        type: 'error',
      });
    }
  };

  const handleSelectTask = (index: number) => {
    setActiveTaskIndex(index);
    setFeedbackMessage(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-6">
      
      {/* Header & Overall Lab Progress */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Guided Lab Experiments
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complete hands-on physics challenges to master the Hall Effect.
            </p>
          </div>
        </div>

        {/* Progress Badge */}
        <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/60 px-3.5 py-1.5 rounded-xl border border-indigo-200/80 dark:border-indigo-800/80">
          <Award className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
            Progress: {completedCount} / {totalTasks} Completed
          </span>
        </div>
      </div>

      {/* Task List Navigation Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        {EXPERIMENT_TASKS.map((task, idx) => {
          const isDone = completedTasks[task.id];
          const isActive = idx === activeTaskIndex;
          return (
            <button
              key={task.id}
              onClick={() => handleSelectTask(idx)}
              className={`p-2.5 rounded-xl text-left border text-xs font-semibold transition-all flex flex-col justify-between gap-1.5 ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : isDone
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>Task {idx + 1}</span>
                {isDone ? (
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                )}
              </div>
              <span className="line-clamp-1 opacity-90 font-normal">{task.title.split('.')[1] || task.title}</span>
            </button>
          );
        })}
      </div>

      {/* Current Task Detail Card */}
      <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{currentTask.title}</span>
          </h3>
          {completedTasks[currentTask.id] && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>VERIFIED PASSED</span>
            </span>
          )}
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <strong>Objective:</strong> {currentTask.objective}
        </p>

        {/* Step Instructions */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
            Step-by-Step Instructions:
          </span>
          <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
            {currentTask.instructions.map((inst, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 shrink-0">{i + 1}.</span>
                <span>{inst}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Feedback Alert */}
        {feedbackMessage && (
          <div className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800'
          }`}>
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>{feedbackMessage.text}</div>
          </div>
        )}

        {/* Verification Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={() => {
              setFeedbackMessage({ text: `Hint: ${currentTask.hint}`, type: 'hint' });
            }}
            className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 flex items-center gap-1"
          >
            <HelpCircle className="w-4 h-4 text-amber-500" />
            <span>Need a hint?</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleVerifyCurrentTask}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify My Setup</span>
            </button>

            {activeTaskIndex < totalTasks - 1 && (
              <button
                onClick={() => handleSelectTask(activeTaskIndex + 1)}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 flex items-center gap-1 transition-colors"
              >
                <span>Next Task</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Lab Completion Award Banner */}
      {completedCount === totalTasks && (
        <div className="p-5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl text-white shadow-md flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-bold text-lg">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>Congratulations! Hall Effect Physics Lab Completed</span>
            </div>
            <p className="text-xs text-emerald-100">
              You have successfully verified carrier polarity, field linearity, current response, and material density sensitivity!
            </p>
          </div>
          <button
            onClick={() => setCompletedTasks({})}
            className="px-3.5 py-2 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs font-bold shrink-0 transition-colors"
          >
            Restart Lab
          </button>
        </div>
      )}

    </div>
  );
};
