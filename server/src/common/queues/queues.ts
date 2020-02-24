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

export const roleQueue = {
  name: 'roleQueue',
  prefix: '@@roleQueue_',
};

const _queues = [userQueue, roleQueue];

export const queues = _queues.map(q => ({
  name: q.name,
  options: { ...queueDefaultOptions, prefix: q.prefix },
}));
export default _queues;
