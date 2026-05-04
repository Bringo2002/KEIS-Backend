import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config';
const client = new Anthropic({
    apiKey: config.ANTHROPIC_API_KEY,
});
export { client };
//# sourceMappingURL=client.js.map