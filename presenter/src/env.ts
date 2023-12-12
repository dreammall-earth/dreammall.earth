const META = {
  DEFAULT_TITLE: (import.meta.env.PUBLIC_ENV__META__DEFAULT_TITLE as string) ?? 'DreamMall',
  DEFAULT_DESCRIPTION:
    (import.meta.env.PUBLIC_ENV__META__DEFAULT_DESCRIPTION as string) ?? 'DreamMall Client',
}

export { META }
