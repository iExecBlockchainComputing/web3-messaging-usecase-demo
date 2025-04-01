import { useState } from 'react';
import telegram_visual from '@/assets/telegram_visual.png';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/style.utils';
import { steps } from './steps';

export default function Resources() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="flex flex-col gap-16 md:flex-row">
      <div className="radial-bg relative max-h-52 min-h-52 overflow-hidden rounded-2xl p-px md:max-h-136 md:w-2/5">
        <div className="bg-background absolute inset-px z-0 overflow-hidden rounded-[calc(16px-1px)] before:absolute before:right-0 before:z-0 before:aspect-square before:h-1/3 before:scale-110 before:rounded-full before:bg-[#BC70FD] before:blur-[100px] after:absolute after:top-0 after:right-0 after:-z-10 after:aspect-[1/2] after:h-full after:scale-125 after:rounded-full after:bg-[#00115C]/70 after:blur-3xl md:before:translate-x-1/2 md:after:translate-x-1/3 md:after:-translate-y-1/3">
          <img
            src={telegram_visual}
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
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
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
            </div>
            <div className="flex flex-col justify-end space-y-4 py-2">
              <h2 className="text-base!">{step.title}</h2>
              {currentStep === index && <div>{step.content}</div>}
              <div className="mt-2 flex justify-end gap-5">
                {currentStep === index && currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                  >
                    Previous step
                  </Button>
                )}
                {currentStep === index && currentStep !== steps.length - 1 && (
                  <Button onClick={() => setCurrentStep((prev) => prev + 1)}>
                    Next step
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
