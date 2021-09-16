export interface _Command {
  prefix: string;
  command: string;
  args: string[];
}

export interface Command {
  name: string;
  function: any;
}

export interface YTVideo {
  type: string;
  videoID: string;
  url: string;
  title: string;
  description: string;
  image: string;
  thumbnail: string;
  seconds: number;
  timestamp: string;
  duration: {
    toString(): string;
    seconds: number;
    timestamp: string;
  };
  ago: string;
  views: number;
  author: {
    name: string;
    url: string;
  };
}
