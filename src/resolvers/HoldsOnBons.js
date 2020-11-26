async function hold(parent, args, context, info) {
 return await context.prisma.holdsOnBons({ id: parent.id }).hold()
}
async function bon(parent, args, context, info){
  return await context.prisma.holdsOnBons({id: parent.id}).bon()
}
module.exports = {
  hold,
  bon
};
