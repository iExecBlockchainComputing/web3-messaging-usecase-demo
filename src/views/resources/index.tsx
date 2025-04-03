import { useState } from 'react';
import lock_file_visual from '@/assets/steps/lock_file_visual.png';
import lock_visual from '@/assets/steps/lock_visual.png';
import send_visual from '@/assets/steps/send_visual.png';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/style.utils';
import { steps } from './steps';

export default function Resources() {
  const [currentStep, setCurrentStep] = useState(0);

  const stepsVisual = [send_visual, lock_visual, lock_file_visual];

  return (
    <div className="flex flex-col gap-16 md:flex-row">
      <div className="radial-bg relative max-h-52 min-h-52 overflow-hidden rounded-2xl p-px md:max-h-136 md:w-2/5">
        <div className="bg-background absolute inset-px z-0 overflow-hidden rounded-[calc(16px-1px)] before:absolute before:right-0 before:z-0 before:aspect-square before:h-1/3 before:scale-110 before:rounded-full before:bg-[#BC70FD] before:blur-[100px] after:absolute after:top-0 after:right-0 after:-z-10 after:aspect-[1/2] after:h-full after:scale-125 after:rounded-full after:bg-[#00115C]/70 after:blur-3xl md:before:translate-x-1/2 md:after:translate-x-1/3 md:after:-translate-y-1/3">
          <img
            src={stepsVisual[currentStep]}
            className="z-30 mx-auto mt-8 w-4/5 max-w-64 md:mt-20"
            alt=""
          />
        </div>
      </div>
      <div className="grow">
        <h1 className="text-center md:text-left md:text-4xl!">
          Web3Messaging Demo
        </h1>
        <p className="font-anybody text-primary mb-4 text-center text-2xl font-bold md:text-left">
          {steps.length} steps
        </p>
        {steps.map((step, index) => (
          <div key={index} className="flex min-h-16 gap-4">
            <Button
              onClick={() => setCurrentStep(index)}
              className="flex flex-col items-center justify-normal gap-0"
              variant="text"
              size="none"
            >
              <span
                className={cn(
                  'flex size-10 items-center justify-center rounded-full border',
                  currentStep >= index
                    ? 'border-primary text-primary bg-primary/10'
                    : 'border-grey-600 bg-grey-600'
                )}
              >
                {index + 1}
              </span>
              {index < steps.length - 1 && (
                <span
                  className={cn(
                    'w-px grow',
                    currentStep >= index ? 'bg-primary' : 'bg-white'
                  )}
                />
              )}
            </Button>
            <div className="flex max-w-full grow flex-col space-y-4.5 py-2">
              <Button
                variant="text"
                size="none"
                className="justify-normal text-left"
                onClick={() => setCurrentStep(index)}
              >
                <h2 className="text-base! text-wrap!">{step.title}</h2>
              </Button>
              {currentStep === index && <>{step.content}</>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
