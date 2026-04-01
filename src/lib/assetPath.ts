const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function imgPath(src: string): string {
  return `${BASE}${src}`;
}
