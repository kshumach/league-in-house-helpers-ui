/* eslint-disable max-classes-per-file */
import { JwtPayload } from 'jwt-decode';
import { LoginRequiredError, UnsafeAccessError } from './errors';

// General
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type InspectableObject = NonNullable<Record<string, unknown>>;

// JWT
export interface CustomJwtPayload extends JwtPayload {
  // eslint-disable-next-line camelcase
  user_id?: string;
}

// Either
interface EitherInterface<T, E extends Error> {
  isLeft: () => boolean;
  isRight: () => boolean;
  unwrapOrThrow: () => T;
  unwrapOrElse: (fallback: T) => T;
  unsafeUnwrap: () => T | E;
}

export class Left<T, E extends Error> implements EitherInterface<T, E> {
  /* eslint-disable no-underscore-dangle, class-methods-use-this */
  private readonly _data: E;

  private hasPerformedSanityCheck: boolean;

  constructor(data: E) {
    this._data = data;

    this.hasPerformedSanityCheck = false;
  }

  isLeft(): boolean {
    this.hasPerformedSanityCheck = true;

    return true;
  }

  isRight(): boolean {
    this.hasPerformedSanityCheck = true;

    return false;
  }

  /** @throws */
  unwrapOrThrow(): T {
    throw this._data;
  }

  /** @throws UnsafeAccessError */
  unsafeUnwrap(): E {
    if (!this.hasPerformedSanityCheck) throw new UnsafeAccessError();

    return this._data;
  }

  unwrapOrElse(fallback: T): T {
    return fallback;
  }
}

export class Right<T, E extends Error> implements EitherInterface<T, E> {
  /* eslint-disable no-underscore-dangle, class-methods-use-this */
  private readonly _data: T;

  constructor(data: T) {
    this._data = data;
  }

  isLeft(): boolean {
    return false;
  }

  isRight(): boolean {
    return true;
  }

  unwrapOrThrow(): T {
    return this._data;
  }

  unsafeUnwrap(): T {
    return this.unwrapOrThrow();
  }

  unwrapOrElse(fallback: T): T {
    if (!this._data) return fallback;

    return this._data;
  }
}

Object.defineProperty(Left, Symbol.hasInstance, {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: (instance: any): boolean => instance.isLeft && instance.isLeft(),
});

Object.defineProperty(Right, Symbol.hasInstance, {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: (instance: any): boolean => instance.isRight && instance.isRight(),
});

export type Either<T, E extends Error> = Left<T, E> | Right<T, E>;

// API

export type ApiMethodReturnValue<T> = Either<T, Error | LoginRequiredError>;

export enum LeagueRole {
  TOP = 'Top',
  JUNGLE = 'Jungle',
  MID = 'Mid',
  MARKSMAN = 'Marksman',
  SUPPORT = 'Support',
}

export enum ValorantRole {
  SENTINEL = 'Sentinel',
  INITIATOR = 'Initiator',
  CONTROLLER = 'Controller',
  DUELIST = 'Duelist',
}

export enum GameOptions {
  LEAGUE = 'League',
  VALORANT = 'Valorant'
}

export type PreferredRolesLeague = {
  primaryRole: Nullable<LeagueRole>;
  secondaryRole: Nullable<LeagueRole>;
  offRole: Nullable<LeagueRole>;
};

export type PreferredRolesValorant = {
  primaryRole: Nullable<ValorantRole>;
  secondaryRole: Nullable<ValorantRole>;
  offRole: Nullable<ValorantRole>;
};

export enum Rankings {
  S = 'S',
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  NOT_RATED = -1,
}

export interface Ballot {
  /* eslint-disable camelcase */
  // Nested in an array so camelizeKeys doesn't convert this
  rated_by: number;
  user_id: number;
  ranking: Rankings;
  ranking_type: GameOptions;
}

export type RankingBallots = Array<Ballot>;
