import os from 'os'
import path from 'path'

export function isJsonString(str: string) {
  try {
    return typeof JSON.parse(str) == 'object'
  } catch (e) {
    return false
  }
}

export function slash(p: string): string {
  return p.replace(/\\/g, '/')
}

export function normalizePath(id: string): string {
  return path.posix.normalize(os.platform() === 'win32' ? slash(id) : id)
}

export function normalizePathResolve(p1, p2) {
  return normalizePath(path.resolve(p1, p2))
}

export const normalizeJsFilename = (p: string) => p.replace(/\.[tj]sx?$/, '.js')

export const normalizeCssFilename = (p: string) => p.replace(/\.less$/, '.css')

export function relaceCssUrlPrefix(code: string) {
  if (typeof code == 'string') {
    return code.replace(/(?<=url\()[\s\S]*?(?=\))/gm, function (str) {
      return (
        'chrome-extension://' +
        slash(path.join('__MSG_@@extension_id__', str.trim()))
      )
    })
  }
  return code
}

export function relaceImgUrlPrefix(code: string) {
  return code.replace(
    /(?<=(=))"[^(?!")]+(\.png|jpg|jpeg|svg|webp)"(?=,|;)/gm,
    function (str) {
      return str.includes('http') ? str : `chrome.runtime.getURL(${str})`
    }
  )
}

export function convertIntoIIFE(code: string) {
  return `;(function(){${code}})()`
}
