/**
 * Resolve link with participant name
 */
export const resolveLink = (link: string, participantName: string): string =>
  link.replace(/\{participantName\}/g, participantName);
