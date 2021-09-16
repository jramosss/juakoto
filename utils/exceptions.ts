export class CouldNotEnqueue extends Error {
  constructor(message: string) {
    super(message);
    this.message = message;
  }
}

export class CouldntGetSong extends Error {
  constructor(message: string) {
    super(message);
    this.message = message;
  }
}

export class BotAlreadyInChannel extends Error {
  constructor(message?: string) {
    super(message);
    this.message = message || '';
  }
}

export class BotInAnotherChannel extends Error {
  constructor(message?: string) {
    super(message);
    this.message = message || '';
  }
}

export class BotNotAllowed extends Error {
  constructor(message?: string) {
    super(message);
    this.message = message || '';
  }
}

export class UserNotInChannel extends Error {
  constructor(message?: string) {
    super(message);
    this.message = message || '';
  }
}
