import React from 'react';
import { cn } from '@/lib/utils';

type BGVariantType = 'dots' | 'diagonal-stripes' | 'grid' | 'horizontal-lines' | 'vertical-lines' | 'checkerboard';
type BGMaskType =
	| 'fade-center'
	| 'fade-edges'
	| 'fade-top'
	| 'fade-bottom'
	| 'fade-left'
	| 'fade-right'
	| 'fade-x'
	| 'fade-y'
	| 'none';

type BGPatternProps = React.ComponentProps<'div'> & {
	mask?: BGMaskType;
	size?: number;
	fill?: string;
};

const maskClasses: Record<BGMaskType, string> = {
	'fade-edges': '[mask-image:radial-gradient(ellipse_at_center,var(--background),transparent)]',
	'fade-center': '[mask-image:radial-gradient(ellipse_at_center,transparent,var(--background))]',
	'fade-top': '[mask-image:linear-gradient(to_bottom,transparent,var(--background))]',
	'fade-bottom': '[mask-image:linear-gradient(to_bottom,var(--background),transparent)]',
	'fade-left': '[mask-image:linear-gradient(to_right,transparent,var(--background))]',
	'fade-right': '[mask-image:linear-gradient(to_right,var(--background),transparent)]',
	'fade-x': '[mask-image:linear-gradient(to_right,transparent,var(--background),transparent)]',
	'fade-y': '[mask-image:linear-gradient(to_bottom,transparent,var(--background),transparent)]',
	none: '',
};

function geBgImage(fill: string, size: number) {

    return `radial-gradient(${fill} 1px, transparent 1px)`;
}

const BGPattern = ({
	mask = 'none',
	size = 24,
	fill = '#252525',
	className,
	style,
	...props
}: BGPatternProps) => {
	const bgSize = `${size}px ${size}px`;
	const backgroundImage = geBgImage(fill, size);

	return (
		<div
			className={cn('absolute inset-0 z-[-10] size-full', maskClasses[mask], className)}
			style={{
				backgroundImage,
				backgroundSize: bgSize,
				...style,
			}}
			{...props}
		/>
	);
};

BGPattern.displayName = 'BGPattern';
export { BGPattern };
