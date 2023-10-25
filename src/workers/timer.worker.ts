/*
let countdownInterval: NodeJS.Timer | null = null;
let currentTime = 0;

onmessage = (e: MessageEvent) => {

  if (e.data.name === 'start') {
    if (!countdownInterval) {
      countdownInterval = setInterval(() => { currentTime++; postMessage(currentTime);}, 1000);
    }
  } else if (e.data.name === 'stop') {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  } else if (e.data.name === 'add') {
    currentTime = currentTime+e.data.amount;
  } else if (e.data.name === 'set') {
    currentTime = e.data.amount;
  }
};
*/