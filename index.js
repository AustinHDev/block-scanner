'use strict'

const BLOCK_START = 24009300; // 2022-03-13T09:41:31.000Z
const BLOCK_END   = 24012075; // 2022-03-13T11:16:02.000Z
const RATIO = 1; // Bank Swap Ratio

const fs = require('fs');
// use this rpc for the scan
const rpc = 'wss://ws.s0.t.hmny.io/';
const Web3 = require('web3');
const web3 = new Web3(rpc);
const jsonInterface = [
    {
        "type": "constructor",
        "inputs": [
            {
                "name": "_wone",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_plts",
                "internalType": "address",
                "type": "address"
            },
            {
                "type": "address",
                "internalType": "address",
                "name": "_hermes"
            },
            {
                "internalType": "address",
                "type": "address",
                "name": "_router"
            },
            {
                "internalType": "uint256",
                "type": "uint256",
                "name": "_rewardPerBlock"
            },
            {
                "type": "uint256",
                "internalType": "uint256",
                "name": "_startBlock"
            },
            {
                "internalType": "uint256",
                "type": "uint256",
                "name": "_rewardEndBlock"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Approval",
        "inputs": [
            {
                "name": "owner",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "type": "address",
                "indexed": true,
                "name": "spender",
                "internalType": "address"
            },
            {
                "name": "value",
                "internalType": "uint256",
                "type": "uint256",
                "indexed": false
            }
        ]
    },
    {
        "anonymous": false,
        "type": "event",
        "inputs": [
            {
                "type": "address",
                "internalType": "address",
                "name": "user",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "amount",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "name": "Deposit"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "indexed": false,
                "name": "amount",
                "type": "uint256"
            }
        ],
        "anonymous": false,
        "name": "DepositRewards",
        "type": "event"
    },
    {
        "type": "event",
        "name": "EmergencyRewardWithdraw",
        "anonymous": false,
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "indexed": true,
                "type": "address"
            },
            {
                "internalType": "uint256",
                "indexed": false,
                "name": "amount",
                "type": "uint256"
            }
        ]
    },
    {
        "inputs": [
            {
                "name": "user",
                "type": "address",
                "internalType": "address",
                "indexed": true
            },
            {
                "name": "token",
                "type": "address",
                "internalType": "contract IERC20",
                "indexed": true
            },
            {
                "internalType": "uint256",
                "indexed": false,
                "type": "uint256",
                "name": "amount"
            }
        ],
        "type": "event",
        "anonymous": false,
        "name": "EmergencySweepWithdraw"
    },
    {
        "type": "event",
        "inputs": [
            {
                "type": "address",
                "name": "user",
                "internalType": "address",
                "indexed": true
            },
            {
                "internalType": "uint256",
                "indexed": false,
                "name": "amount",
                "type": "uint256"
            }
        ],
        "anonymous": false,
        "name": "EmergencyWithdraw"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "rewardEndBlock",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "internalType": "uint256",
                "indexed": false,
                "name": "rewardPerBlock",
                "type": "uint256"
            }
        ],
        "name": "LogUpdatePool",
        "type": "event"
    },
    {
        "anonymous": false,
        "type": "event",
        "inputs": [
            {
                "type": "address",
                "name": "previousOwner",
                "internalType": "address",
                "indexed": true
            },
            {
                "name": "newOwner",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            }
        ],
        "name": "OwnershipTransferred"
    },
    {
        "type": "event",
        "inputs": [
            {
                "name": "user",
                "indexed": true,
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "amount",
                "internalType": "uint256",
                "indexed": false,
                "type": "uint256"
            }
        ],
        "anonymous": false,
        "name": "SkimStakeTokenFees"
    },
    {
        "anonymous": false,
        "type": "event",
        "name": "Transfer",
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "to",
                "indexed": true,
                "type": "address",
                "internalType": "address"
            },
            {
                "type": "uint256",
                "internalType": "uint256",
                "indexed": false,
                "name": "value"
            }
        ]
    },
    {
        "type": "event",
        "inputs": [
            {
                "name": "user",
                "internalType": "address",
                "indexed": true,
                "type": "address"
            },
            {
                "indexed": false,
                "name": "amount",
                "internalType": "uint256",
                "type": "uint256"
            }
        ],
        "anonymous": false,
        "name": "Withdraw"
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "WithdrawReward",
        "inputs": [
            {
                "indexed": true,
                "name": "user",
                "internalType": "address",
                "type": "address"
            },
            {
                "name": "amount",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "name": "allowance",
        "inputs": [
            {
                "name": "owner",
                "type": "address",
                "internalType": "address"
            },
            {
                "type": "address",
                "name": "spender",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "",
                "internalType": "uint256"
            }
        ],
        "type": "function"
    },
    {
        "type": "function",
        "stateMutability": "nonpayable",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "name": "approve",
        "inputs": [
            {
                "name": "spender",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "amount",
                "internalType": "uint256",
                "type": "uint256"
            }
        ]
    },
    {
        "name": "balanceOf",
        "inputs": [
            {
                "name": "account",
                "internalType": "address",
                "type": "address"
            }
        ],
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "stateMutability": "view",
        "name": "decimals",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint8",
                "internalType": "uint8"
            }
        ]
    },
    {
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "name": "decreaseAllowance",
        "stateMutability": "nonpayable",
        "inputs": [
            {
                "type": "address",
                "name": "spender",
                "internalType": "address"
            },
            {
                "name": "subtractedValue",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "type": "function"
    },
    {
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "name": "hermes",
        "type": "function",
        "stateMutability": "view",
        "inputs": []
    },
    {
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "name": "addedValue",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "name": "increaseAllowance",
        "type": "function",
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "stateMutability": "view",
        "outputs": [
            {
                "name": "",
                "internalType": "contract IUniswapV2Pair",
                "type": "address"
            }
        ],
        "name": "lp",
        "inputs": []
    },
    {
        "type": "function",
        "stateMutability": "view",
        "name": "name",
        "inputs": [],
        "outputs": [
            {
                "type": "string",
                "name": "",
                "internalType": "string"
            }
        ]
    },
    {
        "outputs": [
            {
                "type": "address",
                "name": "",
                "internalType": "address"
            }
        ],
        "type": "function",
        "stateMutability": "view",
        "name": "owner",
        "inputs": []
    },
    {
        "name": "plts",
        "inputs": [],
        "type": "function",
        "outputs": [
            {
                "type": "address",
                "internalType": "contract IERC20",
                "name": ""
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "poolInfo",
        "stateMutability": "view",
        "type": "function",
        "outputs": [
            {
                "type": "address",
                "internalType": "contract IERC20",
                "name": "lpToken"
            },
            {
                "internalType": "uint256",
                "type": "uint256",
                "name": "allocPoint"
            },
            {
                "name": "lastRewardBlock",
                "internalType": "uint256",
                "type": "uint256"
            },
            {
                "name": "accRewardTokenPerShare",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "inputs": []
    },
    {
        "type": "function",
        "stateMutability": "nonpayable",
        "inputs": [],
        "outputs": [],
        "name": "renounceOwnership"
    },
    {
        "inputs": [],
        "type": "function",
        "stateMutability": "view",
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "name": "rewardEndBlock"
    },
    {
        "type": "function",
        "stateMutability": "view",
        "name": "rewardPerBlock",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "internalType": "uint256",
                "type": "uint256"
            }
        ],
        "name": "startBlock",
        "stateMutability": "view"
    },
    {
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "string",
                "internalType": "string"
            }
        ],
        "name": "symbol",
        "type": "function",
        "stateMutability": "view"
    },
    {
        "type": "function",
        "stateMutability": "view",
        "inputs": [],
        "name": "totalStaked",
        "outputs": [
            {
                "type": "uint256",
                "internalType": "uint256",
                "name": ""
            }
        ]
    },
    {
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "type": "function",
        "inputs": [],
        "name": "totalSupply",
        "stateMutability": "view"
    },
    {
        "outputs": [
            {
                "internalType": "bool",
                "type": "bool",
                "name": ""
            }
        ],
        "type": "function",
        "stateMutability": "nonpayable",
        "name": "transfer",
        "inputs": [
            {
                "type": "address",
                "internalType": "address",
                "name": "recipient"
            },
            {
                "name": "amount",
                "internalType": "uint256",
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "stateMutability": "nonpayable",
        "outputs": [
            {
                "type": "bool",
                "name": "",
                "internalType": "bool"
            }
        ],
        "name": "transferFrom",
        "inputs": [
            {
                "name": "sender",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "recipient",
                "internalType": "address",
                "type": "address"
            },
            {
                "type": "uint256",
                "internalType": "uint256",
                "name": "amount"
            }
        ]
    },
    {
        "type": "function",
        "name": "transferOwnership",
        "stateMutability": "nonpayable",
        "outputs": [],
        "inputs": [
            {
                "type": "address",
                "name": "newOwner",
                "internalType": "address"
            }
        ]
    },
    {
        "name": "userInfo",
        "type": "function",
        "stateMutability": "view",
        "inputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "amount",
                "internalType": "uint256",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "type": "uint256",
                "name": "rewardDebt"
            }
        ]
    },
    {
        "outputs": [
            {
                "internalType": "bool",
                "type": "bool",
                "name": ""
            }
        ],
        "type": "function",
        "inputs": [],
        "stateMutability": "view",
        "name": "withdrawLocked"
    },
    {
        "type": "function",
        "outputs": [
            {
                "type": "address",
                "internalType": "contract IERC20",
                "name": ""
            }
        ],
        "name": "wone",
        "inputs": [],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "inputs": [
            {
                "name": "_from",
                "internalType": "uint256",
                "type": "uint256"
            },
            {
                "name": "_to",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view",
        "name": "getMultiplier"
    },
    {
        "type": "function",
        "inputs": [
            {
                "internalType": "uint256",
                "type": "uint256",
                "name": "_rewardEndBlock"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable",
        "name": "setBonusEndBlock"
    },
    {
        "inputs": [
            {
                "type": "address",
                "internalType": "address",
                "name": "_user"
            }
        ],
        "type": "function",
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "name": "pendingReward",
        "stateMutability": "view"
    },
    {
        "type": "function",
        "outputs": [],
        "name": "updatePool",
        "inputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "name": "deposit",
        "stateMutability": "nonpayable",
        "inputs": [
            {
                "name": "_amount",
                "internalType": "uint256",
                "type": "uint256"
            }
        ],
        "type": "function",
        "outputs": []
    },
    {
        "type": "function",
        "stateMutability": "nonpayable",
        "name": "withdraw",
        "inputs": [
            {
                "type": "uint256",
                "internalType": "uint256",
                "name": "_amount"
            }
        ],
        "outputs": []
    },
    {
        "inputs": [],
        "type": "function",
        "name": "rewardBalance",
        "stateMutability": "view",
        "outputs": [
            {
                "type": "uint256",
                "internalType": "uint256",
                "name": ""
            }
        ]
    },
    {
        "name": "depositRewards",
        "outputs": [],
        "type": "function",
        "stateMutability": "nonpayable",
        "inputs": [
            {
                "name": "_amount",
                "type": "uint256",
                "internalType": "uint256"
            }
        ]
    },
    {
        "inputs": [],
        "name": "totalStakeTokenBalance",
        "stateMutability": "view",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "type": "function"
    },
    {
        "name": "getStakeTokenFeeBalance",
        "stateMutability": "view",
        "outputs": [
            {
                "internalType": "uint256",
                "type": "uint256",
                "name": ""
            }
        ],
        "type": "function",
        "inputs": []
    },
    {
        "outputs": [],
        "type": "function",
        "stateMutability": "nonpayable",
        "name": "setRewardPerBlock",
        "inputs": [
            {
                "type": "uint256",
                "name": "_rewardPerBlock",
                "internalType": "uint256"
            }
        ]
    },
    {
        "stateMutability": "nonpayable",
        "outputs": [],
        "inputs": [],
        "name": "withdrawReward",
        "type": "function"
    },
    {
        "stateMutability": "view",
        "type": "function",
        "outputs": [
            {
                "type": "uint256",
                "internalType": "uint256",
                "name": ""
            }
        ],
        "inputs": [],
        "name": "getTimestamp"
    },
    {
        "type": "function",
        "outputs": [],
        "name": "setWithdrawStatus",
        "stateMutability": "nonpayable",
        "inputs": [
            {
                "type": "bool",
                "internalType": "bool",
                "name": "_status"
            }
        ]
    },
    {
        "name": "setAdminSwap",
        "inputs": [
            {
                "type": "address",
                "internalType": "address",
                "name": "_contract"
            }
        ],
        "stateMutability": "nonpayable",
        "outputs": [],
        "type": "function"
    },
    {
        "type": "function",
        "stateMutability": "nonpayable",
        "inputs": [],
        "name": "adminSwap",
        "outputs": []
    }
];

const ctx1 = new web3.eth.Contract(jsonInterface, '0xc2c57ea78582c65529C3445eF542985Abde90cd0'); // Testnet WONE Bank

let balances = {}, bytx = [];
async function events(ctx) {
    let size = 1000;
    for (let i = BLOCK_START; i < BLOCK_END; i += size) {
        const from = i;
        const to = (i + size) - 1;
        console.log(`i=${i}, from=${from}, to=${to}`);
        await ctx.getPastEvents({}, {fromBlock: from, toBlock: to},
            function (error, events) {
                if (error) {
                    console.log(error);
                } else {
                    for (let j = 0; j < events.length; j++) {
                        const e = events[j];
                        if (e.event != 'Deposit') continue;
                        const user = e.returnValues;
                        if( ! balances[user.user] )
                            balances[user.user] = 0;
                        const amount = parseInt(user.amount)/1e18;
                        balances[user.user] += amount;
                        console.log('\t', user.user, amount);
                        bytx.push(`${e.transactionHash},${user.user},${amount}`)

                    }
                }
            });
    }

}

async function scanBlockchain(){
    await events(ctx1);
    fs.writeFileSync('./bytx.txt', bytx.join('\n') );
    console.log('\tscan completed and bytx.txt generated with all tx.')
}

async function generateBalance(){
    console.log('loading bytx.txt...');
    const bytx_read = fs.readFileSync('./bytx.txt', 'utf-8').split('\n');
    let balancesArray = {};
    for( let i in bytx_read ){
        const id = bytx_read[i].split(',')[1];
        const bal = bytx_read[i].split(',')[2]
        console.log("🚀 ~ file: index.js ~ line 969 ~ generateBalance ~ id", id)
        if( balances[id] ){
            balancesArray[id] = +balancesArray[id] + +bal
        }else{
        balancesArray[id] = Number(bal).toFixed(18);
        }
        balances[id] = true;
        console.log("🚀 ~ file: index.js ~ line 974 ~ generateBalance ~ balancesArray", balancesArray)
    }
    let txt = [];
    let total = 0;
    for (let i in balancesArray){
        total = +total + +balancesArray[i]
        txt.push(i + "," + balancesArray[i])
        console.log("🚀 ~ file: index.js ~ line 982 ~ generateBalance ~ balancesArray[i]", balancesArray[i])
        console.log("🚀 ~ file: index.js ~ line 982 ~ generateBalance ~ i", i)
    }
    txt.push("total," + total);
    console.log('writing addresses.txt');
    fs.writeFileSync('./addresses.txt', txt.join('\n'));
    console.log('done.')
}

async function balance(user, ctx){
    const info4 = await ctx.methods.balanceOf(user).call();
    return parseFloat( web3.utils.fromWei( info4.toString() ) );
}


function fileExist(file){
    try{
        return fs.existsSync(file)
    }catch(e){

    }
    return false;
}


async function main(){
    if( ! fileExist('bytx.txt') ){
        console.log('Scanning blockchain to load all deposit transactions...')
        await scanBlockchain();
    }
    console.log('Building addresses based on transaction list...')
    await generateBalance();
}

main();
