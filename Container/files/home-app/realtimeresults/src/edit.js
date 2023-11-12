
function setup(openai) {
  $('#edit-input :button').on('click', async function() {
    var input = $(this).siblings('#input').val();
    var instruction = $(this).siblings('#instruction').val();

    $('#response').empty();

    const response = await openai.createEdit({
      model: "text-davinci-edit-001",
      input: input,
      instruction: instruction,
    });

    $('#response').html(response.data.choices[0].text);

  });
}

export default { setup };
