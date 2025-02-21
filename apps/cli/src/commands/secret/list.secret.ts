import type {
  CommandActionData,
  CommandArgument
} from '@/types/command/command.types'
import BaseCommand from '@/commands/base.command'
import ControllerInstance from '@/util/controller-instance'
import { Logger } from '@/util/logger'

export default class ListSecret extends BaseCommand {
  getName(): string {
    return 'list'
  }

  getDescription(): string {
    return 'List all secrets under a project and environment'
  }

  getArguments(): CommandArgument[] {
    return [
      {
        name: '<Project Slug>',
        description: 'Slug of the project whose secrets you want.'
      },
      {
        name: '<Environment Slug>',
        description: 'Slug of the environment whose secrets you want.'
      }
    ]
  }

  async action({ args }: CommandActionData): Promise<void> {
    const [projectSlug, environmentSlug] = args
    const { data, error, success } =
      await ControllerInstance.getInstance().secretController.getAllSecretsOfEnvironment(
        {
          projectSlug,
          environmentSlug
        },
        this.headers
      )

    if (success) {
      const secrets = data
      if (secrets.length > 0) {
        data.forEach((secret: any) => {
          Logger.info(`- ${secret.name} (${secret.value})`)
        })
      } else {
        Logger.info('No secrets found')
      }
    } else {
      Logger.error(`Failed fetching secrets: ${error.message}`)
    }
  }
}
