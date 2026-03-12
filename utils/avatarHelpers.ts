/**
 * Utility functions for avatar handling
 */

/**
 * Gets the first letter(s) from a name for avatar fallback
 * @param name - User name
 * @param maxLetters - Maximum letters to extract (default: 2)
 * @returns Uppercase initials for avatar
 */
export function getAvatarInitials(name: string, maxLetters: number = 2): string {
  if (!name || typeof name !== 'string') {
    return 'U' // Default to 'U' for Unknown
  }

  // Clean the name and split into words
  const cleanName = name.trim()
  const words = cleanName.split(/\s+/).filter(word => word.length > 0)
  
  if (words.length === 0) {
    return 'U'
  }

  // Get first letter of first word
  let initials = words[0][0].toUpperCase()
  
  // If there are more words and we want more letters, add first letter of last word
  if (words.length > 1 && maxLetters > 1) {
    initials += words[words.length - 1][0].toUpperCase()
  }

  return initials.slice(0, maxLetters)
}

/**
 * Determines if a URL is valid and not empty/null
 * @param url - Image URL to check
 * @returns Whether the URL is valid
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') {
    return false
  }
  
  // Check for common invalid patterns
  const invalidPatterns = [
    'null',
    'undefined',
    'empty',
    'default',
    'placeholder'
  ]
  
  const lowerUrl = url.toLowerCase().trim()
  return !invalidPatterns.some(pattern => lowerUrl.includes(pattern)) && 
         lowerUrl.startsWith('http')
}

/**
 * Gets the appropriate avatar source (image URL or fallback to initials)
 * @param imageUrl - Profile image URL
 * @param name - User name for initials fallback
 * @returns Avatar source object
 */
export function getAvatarSource(imageUrl: string | null | undefined, name: string) {
  if (isValidImageUrl(imageUrl)) {
    return { uri: imageUrl }
  }
  
  // Return null to trigger initials fallback
  return null
}

/**
 * Generates a background color based on name for avatar initials
 * @param name - User name
 * @returns Hex color code
 */
export function getAvatarBackgroundColor(name: string): string {
  if (!name || typeof name !== 'string') {
    return '#6B7280' // Gray-500
  }

  // Generate consistent color based on name hash
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  const colors = [
    '#3B82F6', // Blue-500
    '#10B981', // Emerald-500
    '#F59E0B', // Amber-500
    '#EF4444', // Red-500
    '#8B5CF6', // Violet-500
    '#EC4899', // Pink-500
    '#14B8A6', // Teal-500
    '#F97316', // Orange-500
  ]

  return colors[Math.abs(hash) % colors.length]
}
