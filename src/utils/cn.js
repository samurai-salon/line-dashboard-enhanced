// src/utils/cn.js - クラス名結合ユーティリティ
import { clsx } from 'clsx';

export function cn(...inputs) {
  return clsx(inputs);
}

// clsxが利用できない場合のフォールバック
export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}