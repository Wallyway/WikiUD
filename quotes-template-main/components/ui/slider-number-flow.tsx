import NumberFlow from '@number-flow/react'
import * as RadixSlider from '@radix-ui/react-slider'
import clsx from 'clsx'
export default function Slider({ value, className, ...props }: RadixSlider.SliderProps) {
    return (
        <RadixSlider.Root
            {...props}
            value={value}
            className={clsx(className, 'relative flex h-5 w-[200px] touch-none select-none items-center')}
        >
            <RadixSlider.Track className="relative h-[3px] grow rounded-full bg-zinc-100 dark:bg-zinc-800">
                <RadixSlider.Range className="absolute h-full rounded-full bg-black dark:bg-white" />
            </RadixSlider.Track>
            <RadixSlider.Thumb
                className="relative block h-5 w-5 rounded-[1rem] bg-white shadow-md ring ring-black/10"
                aria-label="Volume"
            />
        </RadixSlider.Root>
    )
}

export { Slider }