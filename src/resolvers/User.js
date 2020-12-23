async function hold(parent, args, context, info) {
  return await context.prisma.user({ id: parent.id }).hold();
}
async function bons(parent, args, context, info){
  return await context.prisma.user({id: parent.id}).bons();
}
module.exports = {
  hold, bons
};
