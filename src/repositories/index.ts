import { LocalAuthRepository } from "./local/LocalAuthRepository";
import { LocalTripRepository } from "./local/LocalTripRepository";
import type { AuthRepository, TripRepository } from "./types";

export type { AuthRepository, TripRepository } from "./types";

export const tripRepository: TripRepository = new LocalTripRepository();
export const authRepository: AuthRepository = new LocalAuthRepository();
