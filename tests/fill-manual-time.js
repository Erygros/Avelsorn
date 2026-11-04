const form=Array.from(document.forms).find(form=>form.textContent.includes('Zeit buchen'));
if(!form)throw new Error('Manuelles Zeitformular fehlt.');
const localDate=(epoch)=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(new Date(epoch)).replace(' ','T');
for(const [name,offset] of [['startsAt',120000],['endsAt',60000]]){
 const input=form.querySelector(`input[name="${name}"]`);input.value=localDate(Date.now()-offset);input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));
}
JSON.stringify({dates:Array.from(form.querySelectorAll('input[type="datetime-local"]')).map(input=>({name:input.name,value:input.value,valid:input.checkValidity()}))});
