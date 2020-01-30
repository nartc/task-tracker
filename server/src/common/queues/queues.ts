export const queueDefaultOptions = {
  defaultJobOptions: {
    attempts: 5,
    timeout: 10000,
  },
};

export const userQueue = {
  name: 'userQueue',
  prefix: '@@userQueue_',
};

export const queues = [
  {
    name: userQueue.name,
    options: {
      ...queueDefaultOptions,
      prefix: userQueue.prefix,
    },
  },
];
