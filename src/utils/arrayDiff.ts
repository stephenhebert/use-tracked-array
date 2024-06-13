// Note: uses JSON to serialize and deserialize objects, so it's not suitable for functions, undefined, or other non-serializable values
export default function arrayDiff<T>(
  initial: T[], 
  final: T[], 
  { 
    comparator = (a, b) => a.id === b.id,
    includeModified = true
  }: 
  { 
    comparator?: (a: T, b: T) => boolean,
    includeModified?: boolean
  }
) {
  const added = final.filter(a => !initial.some(b => comparator(a, b)))
  const removed = initial.filter(b => !final.some(a => comparator(a, b)))
  
  if (includeModified === false) return { added, removed }

  const modified = initial.reduce((acc: Object[], a, aIndex) => {
    const b = final.find(b => comparator(a, b))
    if (!b) return acc
    const bIndex = final.indexOf(b)
    const reordered = bIndex !== aIndex
    const updated = JSON.stringify(a) !== JSON.stringify(b)
    if (!reordered && !updated) return acc
    acc.push({ 
      initial: a,
      final: b,
      initialIndex: aIndex,
      finalIndex: bIndex,
      reordered, 
      updated 
    })
    return acc
  }, [])

  return { 
    added, 
    removed, 
    modified,
  }
}