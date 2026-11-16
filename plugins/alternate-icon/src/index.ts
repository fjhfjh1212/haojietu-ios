import { registerPlugin } from '@capacitor/core';

export interface AlternateIconPlugin {
  /** name: "wechat" | "alipay" | null (null = primary icon, 微截图2). */
  setAlternateIcon(options: { name: string | null }): Promise<void>;
  getAlternateIconName(): Promise<{ name: string | null }>;
  supportsAlternateIcons(): Promise<{ supported: boolean }>;
}

const AlternateIcon = registerPlugin<AlternateIconPlugin>('AlternateIcon');

export { AlternateIcon };
