import { DashboardData } from '@/types/dashboard';

export const mockData: DashboardData = {
  kpis: [
    { id:'rev',label:'Current Visible Revenue',value:6325000,priorValue:5780000,format:'currency',description:'All recognized package + game revenue' },
    { id:'qty',label:'Current Ticket Quantity',value:218450,priorValue:205900,format:'number' },
    { id:'pkg',label:'Package Seats',value:84200,priorValue:80100,format:'number' },
    { id:'ar',label:'Outstanding Balance',value:875000,priorValue:1035000,format:'currency',inverseGood:true }
  ],
  monthlyFullSeasonNew:[{month:'Jan',quantity:420,revenue:236000},{month:'Feb',quantity:520,revenue:284000},{month:'Mar',quantity:640,revenue:352000},{month:'Apr',quantity:700,revenue:390000},{month:'May',quantity:720,revenue:401000},{month:'Jun',quantity:760,revenue:424000}],
  productMix:[{category:'Full Season',revenue:3125000},{category:'Mini Plans',revenue:1510000},{category:'Groups',revenue:1245000},{category:'Add-On/Deposits',revenue:445000}],
  paymentStatus:[{label:'Paid',amount:4210000},{label:'Outstanding',amount:875000},{label:'On Plan',amount:1240000}],
  groupLeaderboard:[{name:'A. Gomez',value:2180,revenue:413000},{name:'R. Miller',value:2015,revenue:389000},{name:'D. Lee',value:1880,revenue:354000}],
  fseLeaderboard:[{name:'S. Carter',value:145,revenue:920000},{name:'J. Adams',value:132,revenue:845000}],
  miniPlans:[{name:'Weekend 8-Pack',value:740,revenue:288000},{name:'Family 6-Pack',value:620,revenue:224000}],
  eventLeaderboard:[{event:'Opening Night',tickets:9200,revenue:512000},{event:'Rivalry Night',tickets:8700,revenue:498000},{event:'Holiday Matinee',tickets:7900,revenue:422000}],
  pacing:[{label:'Tickets',current:218450,prior:205900,type:'tickets'},{label:'Revenue',current:6325000,prior:5780000,type:'revenue'}],
  goals:[{metric:'Revenue Goal',actual:6325000,target:7000000,format:'currency'},{metric:'Ticket Goal',actual:218450,target:250000,format:'number'},{metric:'Renewal Rate',actual:0.875,target:0.9,format:'percent'}],
  health:[{label:'Ticket Lines Loaded',status:'good',detail:'212,433 rows'},{label:'Blank Order IDs',status:'warning',detail:'14 rows flagged'},{label:'Legacy Corrections',status:'good',detail:'Applied clean Total Price logic'}],
  legacyNotes:[{legacyFormula:'Individual Revenue from phone field',legacyValue:'$1,024,115',cleanValue:'$998,430',reason:'Phone lookup collisions inflated totals',usingClean:true}],
  lastUpdated:'2026-05-07T04:15:00Z'
};
