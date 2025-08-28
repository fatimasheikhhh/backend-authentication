import logger from 'pino';
import dayjs from 'dayjs';
import { pid } from 'process';
const level:string= process.env.LOG_LEVEL || 'info';

const log= logger({
    transport:{
        target:"pino-pretty"
    },
    level,
    base:{
        pid:pid,
    },
    timestamp: ()=>`,"time":"${dayjs().format('YYYY-MM-DD HH:mm:ss')}"`,
})

export default log;