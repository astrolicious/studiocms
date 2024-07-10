

export const simpleResponse = (statusCode: number, message: string) => {
    if (statusCode !== 200) {
        return new Response(
            JSON.stringify({
                error: message
            }),
            {
                status: statusCode
            }
        )
    }
    return new Response(
        JSON.stringify({
            message: message
        }),
        {
            status: statusCode
        }
    )
}