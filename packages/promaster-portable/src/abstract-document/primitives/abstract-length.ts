export interface AbstractLength {
  /// <summary>
  /// Twip (abbreviating "twentieth of a point") is a typographical measurement,
  /// defined as 1/20 of a typographical point. One twip is 1/1440 inch or 17.639 µm when derived from the
  /// PostScript point at 72 to the inch.
  /// </summary>
  readonly twips: number;
}

export function create(twips: number): AbstractLength {
  return {
    twips,
  }
}

export function fromTwips(twips: number): AbstractLength {
  return create(twips);
}

export function fromPoints(points: number): AbstractLength {
  return create(points * 20);
}

export function fromInch(inch: number): AbstractLength {
  return create(inch * 1440);
}


export function asTwips(length: AbstractLength): number {
  return length.twips;
}

export function asPoints(length: AbstractLength): number {
  return length.twips / 20;
}

export function asInch(length: AbstractLength): number {
  return length.twips / 1440;
}
