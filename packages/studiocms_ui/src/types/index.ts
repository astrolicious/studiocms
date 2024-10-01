type PersistentToastProps = {
	persistent: true;
	closeButton: true;
};

type NormalToastProps = {
	persistent?: false;
	closeButton?: boolean;
};

export type ToastProps = (PersistentToastProps | NormalToastProps) & {
	title: string;
	description?: string;
	type: 'success' | 'warning' | 'danger' | 'info';
	duration?: number;
};
