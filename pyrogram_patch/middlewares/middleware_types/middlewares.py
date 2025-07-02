from typing import Type, Any, Tuple, TypeVar
from pyrogram.handlers import (
    CallbackQueryHandler,
    ChatJoinRequestHandler,
    ChatMemberUpdatedHandler,
    ChosenInlineResultHandler,
    DeletedMessagesHandler,
    DisconnectHandler,
    EditedMessageHandler,
    InlineQueryHandler,
    MessageHandler,
    PollHandler,
    RawUpdateHandler,
    UserStatusHandler,
)
from pyrogram.handlers.handler import Handler

T = TypeVar('T', bound=Handler)


class BaseMiddleware:
    """Base middleware class for all Pyrogram middlewares."""
    handler_type: Type[Handler]
    
    def __eq__(self, other: Any) -> bool:
        """Check if this middleware matches a handler type.
        
        Args:
            other: The handler type to compare against
            
        Returns:
            bool: True if this middleware handles the given handler type
        """
        return other == self.handler_type
    
    def __hash__(self) -> int:
        """Make the middleware hashable."""
        return hash(self.handler_type)


class OnUpdateMiddleware(BaseMiddleware):
    """Middleware that matches all handler types."""
    
    def __eq__(self, other: Any) -> bool:
        return True
    
    def __hash__(self) -> int:
        return hash('OnUpdateMiddleware')


class OnEditedMessageMiddleware(BaseMiddleware):
    """Middleware for handling edited message events."""
    handler_type = EditedMessageHandler


class OnUserStatusMiddleware(BaseMiddleware):
    """Middleware for handling user status updates."""
    handler_type = UserStatusHandler


class OnRawUpdateMiddleware(BaseMiddleware):
    """Middleware for handling raw updates."""
    handler_type = RawUpdateHandler


class OnChosenInlineResultMiddleware(BaseMiddleware):
    """Middleware for handling chosen inline results."""
    handler_type = ChosenInlineResultHandler


class OnDeletedMessagesMiddleware(BaseMiddleware):
    """Middleware for handling deleted messages."""
    handler_type = DeletedMessagesHandler


class OnChatMemberUpdatedMiddleware(BaseMiddleware):
    """Middleware for handling chat member updates."""
    handler_type = ChatMemberUpdatedHandler


class OnChatJoinRequestMiddleware(BaseMiddleware):
    """Middleware for handling chat join requests."""
    handler_type = ChatJoinRequestHandler


class OnCallbackQueryMiddleware(BaseMiddleware):
    """Middleware for handling callback queries."""
    handler_type = CallbackQueryHandler


class OnInlineQueryMiddleware(BaseMiddleware):
    """Middleware for handling inline queries."""
    handler_type = InlineQueryHandler


class OnDisconnectMiddleware(BaseMiddleware):
    """Middleware for handling disconnection events."""
    handler_type = DisconnectHandler


class OnMessageMiddleware(BaseMiddleware):
    """Middleware for handling new messages."""
    handler_type = MessageHandler


class OnPollMiddleware(BaseMiddleware):
    """Middleware for handling poll updates."""
    handler_type = PollHandler


class MixedMiddleware:
    """Middleware that can handle multiple handler types.
    
    Example:
        patch_manager.include_middleware(CheckIgnoreMiddleware((MessageHandler, EditedMessageHandler)))
    
    class CheckIgnoreMiddleware(MixedMiddleware):
        def __init__(self, handlers: Tuple[Type[Handler], ...], ignore: bool = False) -> None:
            self.ignore = ignore  # Custom middleware-specific attribute
            super().__init__(handlers)
    """
    
    def __init__(self, handlers: Tuple[Type[Handler], ...]) -> None:
        """Initialize the mixed middleware with the specified handler types.
        
        Args:
            handlers: Tuple of handler types this middleware should handle
            
        Raises:
            ValueError: If no handlers are provided
        """
        if not handlers:
            raise ValueError("At least one handler type must be provided")
        self._handlers = handlers
    
    def __eq__(self, other: Any) -> bool:
        """Check if this middleware matches any of its registered handler types."""
        return other in self._handlers
    
    def __hash__(self) -> int:
        """Make the middleware hashable based on its handlers."""
        return hash(self._handlers)
