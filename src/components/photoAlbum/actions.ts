let resizeObserver: ResizeObserver

export function resize(node: Element) {
  if (!resizeObserver) {
    resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.dispatchEvent(
          new CustomEvent("bp:resize", {
            detail: {
              cr: entry.contentRect
            }
          })
        )
      })
    })
  }

  resizeObserver.observe(node)
  return {
    destroy() {
      resizeObserver.unobserve(node)
    }
  }
}
