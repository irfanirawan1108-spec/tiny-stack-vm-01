// How this runs: each opcode is decoded through one lookup string that
// packs its operand size and stack effect, so the main loop stays a single
// switch. Anything illegal -- a bad opcode, an empty stack, a bad address,
// a divide by zero, or running past the step budget -- stops the program
// with a trap code instead of crashing the runner.
// Tiny stack VM (ISA v1): runs every /input/<id>/program.bin on /input/<id>/input.bin
// and writes /output/<id>/stdout.bin + /output/<id>/exit.txt. Node 22, no deps.
import{readFileSync,readdirSync,mkdirSync,writeFileSync}from'node:fs';
import{join}from'node:path';
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
// Opcode table, one char per byte 0x00..0x53: charCode-35 = imm*16+pops*4+pushes ('#' = unused).
const T="#4d')-.2########,,,,,,,(,,,(,,,#,,,#############CGGC############(+##############''$'";
for(const d of readdirSync(I).sort()){
 const P=readFileSync(join(I,d,'program.bin')),N=readFileSync(join(I,d,'input.bin'));
 const D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),B=new Uint8Array(65536);
 let s=0,c=0,p=0,t=0,l=0,q=0,e=0,a=0,b=0,r=0;
 outer:for(;;){
  // Step budget spent: halt with the step-limit trap code.
  if(t===1e6){e=10;break}
  if(p<0||p>=P.length){e=9;break}
  const o=P[p];
  if(!(o<8||(o>=16&&o<=34&&o!==31)||(o>=48&&o<=52)||(o>=64&&o<=65)||(o>=80&&o<=83))){e=5;break}
  const v=T.charCodeAt(o)-35,im=v>>4,po=(v>>2)&3,pu=v&3;
  if(p+im>=P.length){e=9;break}
  t++;
  const n=p+1+im;
  if(s<po){e=2;break}
  if(s-po+pu>256){e=3;break}
  p=n;
  switch(o){
   case 0:break outer;
   case 1:D[s++]=(P[n-1]<<24)>>24;break;
   case 2:D[s++]=P[n-4]|P[n-3]<<8|P[n-2]<<16|P[n-1]<<24;break;
   case 3:s--;break;
   case 4:D[s]=D[s-1];s++;break;
   case 5:a=D[s-1];D[s-1]=D[s-2];D[s-2]=a;break;
   case 6:D[s]=D[s-2];s++;break;
   case 7:a=D[s-3];D[s-3]=D[s-2];D[s-2]=D[s-1];D[s-1]=a;break;
   case 23:D[s-1]=-D[s-1]|0;break;
   case 27:D[s-1]=~D[s-1];break;
   case 48:case 49:case 50:{
    const f=((P[n-2]|P[n-1]<<8)<<16)>>16;
    let k=1;
    if(o!==48){a=D[--s];k=o===49?a===0:a!==0}
    if(k)p=n+f;
    break}
   case 51:if(c===64){e=7;break outer}C[c++]=n;p=P[n-2]|P[n-1]<<8;break;
   case 52:if(c===0){e=8;break outer}p=C[--c];break;
   case 64:a=D[s-1];if(a<0||a>255){e=6;break outer}D[s-1]=M[a];break;
   case 65:a=D[s-1];b=D[s-2];if(a<0||a>255){e=6;break outer}s-=2;M[a]=b;break;
   case 80:{const w=String(D[s-1]);if(l+w.length>65536){e=11;break outer}s--;for(let k=0;k<w.length;k++)B[l++]=w.charCodeAt(k);break}
   case 81:if(l+1>65536){e=11;break outer}B[l++]=D[--s]&255;break;
   case 82:D[s++]=q<N.length?N[q++]:-1;break;
   case 83:e=D[--s]&255;break outer;
   default:
    b=D[s-1];a=D[s-2];
    switch(o){
     case 16:r=a+b|0;break;
     case 17:r=a-b|0;break;
     case 18:r=Math.imul(a,b);break;
     case 19:if(!b){e=4;break outer}r=a===-2147483648&&b===-1?a:(a/b)|0;break;
     case 20:if(!b){e=4;break outer}r=b===-1?0:a%b|0;break;
     case 21:if(!b){e=4;break outer}r=Math.floor((a>>>0)/(b>>>0))|0;break;
     case 22:if(!b){e=4;break outer}r=(a>>>0)%(b>>>0)|0;break;
     case 24:r=a&b;break;
     case 25:r=a|b;break;
     case 26:r=a^b;break;
     case 28:r=a<<(b&31);break;
     case 29:r=a>>(b&31);break;
     case 30:r=a>>>(b&31)|0;break;
     case 32:r=a===b?1:0;break;
     case 33:r=a<b?1:0;break;
     case 34:r=(a>>>0)<(b>>>0)?1:0;break;
    }
    s-=2;D[s++]=r;
  }
 }
 mkdirSync(join(O,d),{recursive:true});
 writeFileSync(join(O,d,'stdout.bin'),B.subarray(0,l));
 writeFileSync(join(O,d,'exit.txt'),e+'\n');
}
