import { Resend } from 'resend';


const resend = new Resend('re_2dtQfq2M_Pdtc4piKUtJaJ6MafXQkszDd');

const { data, error } = await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: ['ecuevah70@gmail.com'],
  subject: 'hello world',
  html: '<p>oxigeno</p>',
  replyTo: 'edwin.cueva@fresnos.com',
});


console.log(data)
console.log(error)