import TelegramBot from "node-telegram-bot-api";
import { PrismaClient } from "@prisma/client";



const prisma = new PrismaClient()
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  throw new Error("TELEGRAM_BOT_TOKEN is not provided");
}
const bot = new TelegramBot(token!, { polling: true });

// y = y0 + ((y1 - y0) / (x1 - x0)) * (x - x0)
function linearInterpolation(x: number, x0: number, y0: number, x1:number, y1: number) {
  if (x < x0 || x > x1) {
      throw new Error("x is out of bounds");
  }
  const ratio = (y1 - y0) / (x1 - x0)
  return Math.floor(y0 + ratio * (x - x0));
}

function genUnixTimestamp(date: Date): number {
  return Math.floor(date.getTime() / 1000)
}

let usersMap = new Map<number, Date>();
let minId: number;
let maxId: number;

function getDate(input: number){
  if (usersMap.size === 0 || minId === undefined || maxId === undefined) {
    return;
  } 
  if (input < minId) {
    return usersMap.get(minId)!;
  } else if (input > maxId) {
    return usersMap.get(maxId)!;
  } else {
    let lid = minId;
    const ids = Array.from(usersMap.keys());
    for(const id of ids){
      if(input <= id){
        const uid = id;
        const uDateUnix = genUnixTimestamp(usersMap.get(uid)!);
        const lDateUnix = genUnixTimestamp(usersMap.get(lid)!);
        const result = linearInterpolation(input, lid, lDateUnix, uid, uDateUnix)
        return new Date(result * 1000);

      }else{
        lid = id;
      }
    }
  }
}

async function init(){
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'asc'
    }
  })
  if (users.length === 0) {
    return;
  }
  usersMap = new Map<number, Date>();

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    usersMap.set(user.id, user.createdAt);
  }
  minId = users[0].id
  maxId = users[users.length - 1].id
}

init()




bot.onText(/\/addData (.+)/, async (msg, match: any) => {
  const params = match[1].split(" ")
  const userId = params[0]
  const createdAt = params[1]
  // isert into db
  try {
    await prisma.user.create({
      data: {
        id: parseInt(userId as string),
        createdAt: new Date(parseInt(createdAt as string)*1000)
      }
    })
    bot.sendMessage(msg.chat.id, `User ${userId} created at ${createdAt}`)
    init()
    console.log(`User ${userId} created at ${createdAt}`)
  } catch (error) {
    console.log(error)
    bot.sendMessage(msg.chat.id, `Error: create user failed`)
  }


});


bot.onText(/\/estimate (.+)/, (msg, match: any) => {
  const userId = match[1]
  console.log(`Estimate userId ${userId} createdAt`)
  const result = getDate(parseInt(userId as string))
  bot.sendMessage(msg.chat.id, `result: ${result}`)
 
});