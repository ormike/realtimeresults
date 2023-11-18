function setup(openai) {
  $('#completion-input :button').on('click', async function() {
    var prompt = $(this).siblings('#prompt').val();
    var maxTokens = $(this).siblings('#max-tokens').val();
    maxTokens = parseInt(maxTokens);

    $('#response').empty();

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: maxTokens,
    });

    $('#response').html(response.data.choices[0].text);

  });
}

export default { setup };
